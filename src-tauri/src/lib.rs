use tauri::{
    Builder,
    tray::TrayIconBuilder,
    tray::{MouseButton, MouseButtonState, TrayIconEvent},
    Manager,
};

use comrak::{markdown_to_html, Options};
use std::fs;
use std::sync::Mutex;

use tauri::{AppHandle, Emitter, Listener};
use tauri_plugin_positioner::{Position, WindowExt};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

#[derive(Default)]
struct AppState {
    note: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::Menu,
                Some(NSVisualEffectState::Active),
                Some(0.0),
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
