# EduAirControl Mobile

EduAirControl Mobile is the mobile application of EduAirControl, built with **Expo and React Native**. Its functional organization follows the same architecture as the web frontend, adapting navigation to native stacks and bottom tabs.

## Structure

```text
Mobile/
└── Front-End/
    ├── App.js
    ├── index.js
    ├── assets/
    └── src/
        ├── context/
        │   ├── EnvironmentContext.jsx
        │   └── ThemeContext.jsx
        ├── navigation/
        │   └── AppNavigator.jsx
        ├── modules/
        │   ├── auth/pages/
        │   │   ├── forgotPassword/
        │   │   │   ├── ForgotPasswordScreen.jsx
        │   │   │   └── ForgotPasswordScreen.styles.js
        │   │   ├── login/
        │   │   ├── signUp/
        │   │   ├── verifyCode/
        │   │   ├── changePassword/
        │   │   └── terms/
        │   ├── dashboard/pages/dashboard/
        │   ├── environment/pages/
        │   │   ├── allEnvironments/
        │   │   ├── environmentDetail/
        │   │   └── environmentManagement/
        │   ├── favorites/pages/favorites/
        │   ├── notifications/pages/notifications/
        │   ├── profile/pages/profile/
        │   ├── ranking/pages/ranking/
        │   └── settings/pages/settings/
        ├── shared/
        │   ├── accessibility/
        │   ├── components/
        │   ├── config/
        │   ├── constants/
        │   ├── i18n/
        │   ├── services/
        │   ├── storage/
        │   └── styles/
        └── viewmodels/
```

Each screen follows the same organizational structure as the web frontend: its JSX logic and styles are grouped together in its own directory. In React Native, `.styles.js` files replace the web frontend's `.css` files, using `StyleSheet.create` to define styles.

The `landing` module is not included in the mobile application. The `ranking` module is maintained as a distinct architectural module and reuses the consolidated dashboard view, which serves as the main ranking screen in the mobile experience.

## Functional Modules

| Module          | Responsibility                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `auth`          | User authentication, registration, password recovery, code verification, password changes, and terms and conditions. |
| `dashboard`     | Consolidated rankings, filters, scoring, and quick access to environments.                                           |
| `environment`   | Environment listing, details, management, services, and utilities.                                                   |
| `favorites`     | Viewing and managing favorite environments.                                                                          |
| `notifications` | Notifications derived from environmental metrics and notification filters.                                           |
| `profile`       | Profile viewing and editing.                                                                                         |
| `ranking`       | Architectural entry point for ranking functionality.                                                                 |
| `settings`      | Application preferences, language, theme, and configuration.                                                         |

## Running the Application

Navigate to the frontend directory:

```bash
cd Front-End
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

### Android Bundle Verification

To verify the native Android bundle, run:

```bash
npm run check:android
```

## Platform Support

Web export is not part of the mobile application's scope. It requires adding `react-dom` and `react-native-web` as dependencies.

These dependencies are intentionally excluded because the project's target platforms are **Android and iOS**.
