use std::fs::File;

pub struct AppState {
    img_base_url: String,
}

impl AppState {
    pub fn new() -> Self {
        let config_file = File::open("./config.json").unwrap();
        AppState {
            img_base_url: String::new(),
        }
    }
}
