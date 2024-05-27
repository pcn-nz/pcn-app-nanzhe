use std::{
    fs::{self, File},
    io::Write,
    path::Path,
};

use scraper::{Html, Selector};
use tauri_plugin_http::reqwest;

#[tauri::command]
pub fn get_config() -> bool {
    Path::new("config.toml").exists()
}

#[tauri::command]
pub async fn get_urls(url: String) -> Vec<(String, String)> {
    let mut urls: Vec<(String, String)> = Vec::new();
    let html = get_html(url).await;
    let selector = Selector::parse("table#ajaxtable tbody tr td h3 a").unwrap();
    for el in html.select(&selector) {
        urls.push((el.attr("href").unwrap().to_string(), el.inner_html()));
    }
    urls
}

#[tauri::command]
pub async fn get_images(url: String) -> Vec<String> {
    let mut images: Vec<String> = Vec::new();
    let html = get_html(url).await;
    let selector = Selector::parse("div#read_tpc img").unwrap();
    for el in html.select(&selector) {
        images.push(el.attr("src").unwrap().to_string())
    }
    images
}

#[tauri::command]
pub async fn get_base_url() -> String {
    let default_url = String::from("https://xp.1024hgc.org/bbs.php");
    let res = reqwest::get(default_url).await.unwrap();
    let url = res.url();
    format!("https://{}{}", url.domain().unwrap(), url.path())
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
pub async fn get_video_list(url: String) -> Vec<(String, String, String)> {
    let mut video_list: Vec<(String, String, String)> = Vec::new();
    let html = get_html(url).await;
    let selector = Selector::parse("div#app a.videoBox").unwrap();
    let el_selector = Selector::parse("div.videoBox_wrap").unwrap();
    for el in html.select(&selector) {
        for element in el.select(&el_selector) {
            video_list.push((
                el.attr("title").unwrap().to_string(),
                el.attr("href").unwrap().to_string(),
                element.html()[133..161].to_string(),
            ))
        }
    }

    video_list
}

async fn get_html(url: String) -> Html {
    let res = reqwest::get(url).await.unwrap();
    let html = Html::parse_document(&res.text().await.unwrap());
    html
}
