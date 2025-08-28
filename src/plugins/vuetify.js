import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';


export const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {dark: false},
            dark: {
                colors: {
                    background: '#000000',
                    surface: '#000000'
                },
                dark: true
            }
        }
    }
});
