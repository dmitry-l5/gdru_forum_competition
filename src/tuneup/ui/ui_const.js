export const LAYOUTS_UI = {
    MAIN : 'main_ui',
    MAP : 'map',
    CONTROL : 'controls',
    PLAYER_SETUP: 'equipment',
    COMPLETE: 'complete',
    MANAGEMENT:'team_setup',
    FIRST_HERO:'first_hero_select',
}

export const UI_EVENTS = {
    CHANGE_LANG: 'change_lang',
    NEW_GAME: 'new_game',
    CONTINUE_GAME: 'continue_game',
    SOUND_ENABLE: 'sound_enable',
    SOUND_DISABLE: 'sound_disable',
    SELECT_FIRST_HERO:"select_first_hero",
    SELECT_FIRST_HERO_CONFIRM:"select_first_hero_confirm",
    MAIN_MENU:'main_menu',
    GO_TO_MAP:'go_to_map',
    DEBUG_DATASET:'debug_dataset',
    HERO_BUTTON:'hero_btn',
    HERO_SINGLE_SELECT:'hero_single_select',
    HERO_ADD_SELECT:'hero_add_select',
    HERO_REMOVE_SELECT:'hero_remove_select',
    UPDATE_TEAM_DATA:'update_team_data',
    HERO_TOGGLE_SELECT:'hero_toogle_select',
}


/**
 * Цветовая схема для пользовательского интерфейса (КРИНЖ / ACID NEON)
 */
export const UI_COLORS = {
    BACKGROUND_DARK:    '#0A001F', 
    BACKGROUND_SEMI_DARK: '#0a001fd9', 

    TEXT_MAIN:          '#00FFFF',
    TEXT_SECONDARY:     '#7FFF00',
    
    ACCENT_PRIMARY:     '#FF00CC', 
    ACCENT_SECONDARY:   '#8A2BE2', 
    
    BUTTON_DEFAULT:     '#220A47', 
    BUTTON_HOVER:       '#3F007F', 
    BUTTON_TEXT:        '#F0F8FF',
    BUTTON_BORDER:      '#FF00CC',
    BUTTON_BORDER_SELECTED : 
                        '#FFFF00',
    BUTTON_BORDER_DEFAULT : 
                        '#000000',
                        
    STATUS_HEALTH:      '#00FF00', 
    STATUS_CRITICAL:    '#FF3300', 
    STATUS_WARNING:     '#CCFF00',
    
    CLASS_DAMAGE:       '#FF0066', 
    CLASS_TANK:         '#00BFFF', 
    CLASS_SUPPORT:      '#00CED1',

};