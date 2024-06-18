use std::{
    fs::{self, File},
    io::Write,
    path::Path,
};

use regex::Regex;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use tauri::WebviewWindowBuilder;
use tauri_plugin_http::reqwest;

#[derive(Deserialize, Debug, Serialize)]
struct Redis {
    host: String,
}

#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    Http(#[from] reqwest::Error),

    #[error(transparent)]
    Tauri(#[from] tauri::Error),
}

impl serde::Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
pub fn get_config() -> bool {
    // let mut config = File::create("config.toml").unwrap();
    true
}

#[tauri::command]
pub async fn get_urls(url: String) -> Result<Vec<(String, String)>, CommandError> {
    let mut urls: Vec<(String, String)> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse("table#ajaxtable tbody tr td h3 a").unwrap();
    for el in html.select(&selector) {
        urls.push((el.attr("href").unwrap().to_string(), el.inner_html()));
    }
    Ok(urls)
}

#[tauri::command]
pub async fn get_images(url: String) -> Result<Vec<String>, CommandError> {
    let mut images: Vec<String> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse("div#read_tpc img").unwrap();
    for el in html.select(&selector) {
        images.push(el.attr("src").unwrap().to_string())
    }
    Ok(images)
}

#[tauri::command]
pub async fn get_base_url() -> Result<String, CommandError> {
    let default_url = String::from("https://xp.1024hgc.org/bbs.php");
    let res = reqwest::get(default_url).await?;
    let url = res.url();
    println!("获取的网址：{:?}", url);
    let url_path = url.path().to_string();
    Ok(format!(
        "https://{}{}",
        url.domain().unwrap(),
        url_path[0..=3].to_string()
    ))
}

#[tauri::command]
pub async fn images_download(images: Vec<String>, dir: String) -> bool {
    for image in images {
        let img_string: Vec<&str> = image.split("/").collect();
        let img_filename = img_string[img_string.len() - 1];
        let dir_path = format!("E://{}", dir);
        let _ = fs::create_dir_all(dir_path);
        let file_full_path = format!("E://{}/{}", dir, img_filename);
        let mut file = File::create(Path::new(&file_full_path)).unwrap();
        let res = reqwest::get(image).await.unwrap();
        let mut content = Vec::new();
        res.bytes().await.unwrap().iter().for_each(|b| {
            content.push(*b);
        });
        file.write_all(&content).unwrap();
    }
    true
}

#[tauri::command]
pub async fn get_video_list(url: String) -> Result<Vec<(String, String, String)>, CommandError> {
    let mut video_list: Vec<(String, String, String)> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse("div#app a.videoBox").unwrap();
    let el_selector = Selector::parse("div.videoBox_wrap").unwrap();
    let img_regex = Regex::new(r"/\d{5,8}/\d{1,5}/\d{1,5}/\d{1,5}\.mp4\.jpg").unwrap();
    let mut img_src = String::new();
    for el in html.select(&selector) {
        for element in el.select(&el_selector) {
            if let Some(i_src) = img_regex.find(&element.html().to_string()) {
                img_src = i_src.as_str().to_string();
            };
            video_list.push((
                // el.attr("title").unwrap().to_string(),
                "".to_string(),
                el.attr("href").unwrap().to_string(),
                img_src.clone(),
            ))
        }
    }
    Ok(video_list)
}

#[tauri::command]
pub async fn open_player(app: tauri::AppHandle) -> Result<(), CommandError> {
    let builder =
        WebviewWindowBuilder::new(&app, "player", tauri::WebviewUrl::App("player.html".into()));
    builder
        .title("Player")
        .decorations(false)
        .center()
        .build()?;
    Ok(())
}

async fn get_html(url: String) -> Result<Html, reqwest::Error> {
    let res = reqwest::get(url).await?;
    let html = Html::parse_document(&res.text().await.unwrap());
    Ok(html)
}
