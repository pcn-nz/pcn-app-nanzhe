use std::{
    fs::{self, File},
    io::Write,
    path::Path,
};

use crate::{assignment::AssignmentNode, Assignment};
use regex::Regex;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use tauri::{http::header::USER_AGENT, WebviewWindowBuilder};
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
pub fn get_config(
    state: tauri::State<'_, Assignment>,
) -> Result<Vec<AssignmentNode>, CommandError> {
    let assignments = state.assignments.clone();
    Ok(assignments)
}

#[tauri::command]
pub async fn get_urls(
    state: tauri::State<'_, Assignment>,
    url: String,
) -> Result<Vec<(String, String)>, CommandError> {
    let mut urls: Vec<(String, String)> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse(&state.assignments[0].selector[0]).unwrap();
    for el in html.select(&selector) {
        urls.push((el.attr("href").unwrap().to_string(), el.inner_html()));
    }
    Ok(urls)
}

#[tauri::command]
pub async fn get_images(
    state: tauri::State<'_, Assignment>,
    url: String,
) -> Result<Vec<String>, CommandError> {
    let mut images: Vec<String> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse(&state.assignments[0].selector[1]).unwrap();
    for el in html.select(&selector) {
        images.push(el.attr("src").unwrap().to_string())
    }
    Ok(images)
}

#[tauri::command]
pub async fn get_base_url(state: tauri::State<'_, Assignment>) -> Result<String, CommandError> {
    let default_url = &state.assignments[0].url[0];
    let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0";
    let client = reqwest::Client::new();
    let res = client
        .get(default_url)
        .header(USER_AGENT, user_agent)
        .send()
        .await;
    let mut uri = String::new();
    match res {
        Ok(resp) => {
            for ck in resp.cookies() {
                println!("Cookies: {:?}", ck.value());
            }
            uri = format!(
                "https://{}{}",
                resp.url().domain().unwrap(),
                resp.url().path().to_string()[0..=3].to_string()
            )
        }
        Err(e) => {
            if let Some(url) = e.url() {
                uri = format!(
                    "https://{}{}",
                    url.domain().unwrap(),
                    url.path().to_string()[0..=3].to_string()
                )
            };
        }
    }

    Ok(uri)
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
pub async fn get_video_list(
    state: tauri::State<'_, Assignment>,
    url: String,
) -> Result<Vec<(String, String)>, CommandError> {
    let mut video_list: Vec<(String, String)> = Vec::new();
    let html = get_html(url).await?;
    let selector = Selector::parse(&state.assignments[1].selector[0]).unwrap();
    let img_regex = Regex::new(r"/\d{5,8}/\d{1,5}/\d{1,5}/\d{1,5}\.mp4\.jpg").unwrap();
    let title_regex = Regex::new(r">&nbsp;.*&nbsp;</").unwrap();
    let mut title_str = "";
    for el in html.select(&selector) {
        if let Some(i_src) = img_regex.find(&el.html()) {
            if let Some(title) = title_regex.find(&el.html()) {
                title_str = title.as_str();
                video_list.push((
                    title_str[7..title_str.len() - 8].to_string(),
                    i_src.as_str().to_string(),
                ))
            }
        };
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
    let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0";
    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .header(USER_AGENT, user_agent)
        .send()
        .await;
    let html = Html::parse_document(&res?.text().await.unwrap());
    Ok(html)
}
