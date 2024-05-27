// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_urls,
            commands::get_images,
            commands::get_base_url,
            commands::images_download,
            commands::get_video_list,
            commands::get_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
