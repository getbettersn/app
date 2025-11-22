use tauri::{
    tray::TrayIconBuilder,
    tray::{MouseButton, MouseButtonState, TrayIconEvent},
    Manager,
};

use comrak::{markdown_to_html, Options};
use std::fs;

use tauri::{AppHandle, Emitter, Listener};
use tauri_plugin_positioner::{Position, WindowExt};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            // remove from Dock
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            app.listen("quitProgram", |_event| std::process::exit(0));

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::Menu,
                Some(NSVisualEffectState::Active),
                Some(6.0),
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .on_tray_icon_event(|tray, event| {
            tauri_plugin_positioner::on_tray_event(tray, &event);
            match event {
                TrayIconEvent::Click {
                    position: _,
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } => {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.move_window(Position::TrayCenter);
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                }
                _ => {
                    println!("unhandled event {event:?}")
                }
            }
        })
        .on_page_load(|app, _payload| {
            // TODO: Enviar el archivo al frontend
            app.emit("ready", "100").unwrap();
            // get the markdown file
            // let filepath = "sample.md".to_string();
            // let contents = fs::read_to_string(filepath).expect("Couldn't find any file...");

            // let markdown = markdown_to_html(&contents, &Options::default());

            // app.emit("markdown", &markdown).unwrap();
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
