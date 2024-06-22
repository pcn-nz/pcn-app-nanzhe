use serde::{Deserialize, Serialize};
use std::{error::Error, fs::File, io::Read};

#[derive(Deserialize, Serialize, Debug)]
pub struct Assignment {
    pub assignments: Vec<AssignmentNode>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct AssignmentNode {
    pub url: String,
    pub assignment_type: String,
    pub selector: Vec<String>,
}

impl Assignment {
    pub fn init() -> Result<Self, Box<dyn Error>> {
        let mut assignment_file = File::open("./assignment.json")?;
        let mut assignment_json_string = String::new();
        assignment_file.read_to_string(&mut assignment_json_string)?;
        let assignment_json_obj: Assignment = serde_json::from_str(&assignment_json_string)?;
        Ok(assignment_json_obj)
    }
}
