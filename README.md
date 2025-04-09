# TV Series Tracker

A responsive React application for tracking your favorite TV series. This app allows you to maintain a personal catalog of TV series you are watching, have watched, or plan to watch in the future.

## Features

- **Add TV Series**: Create entries with title, genre, status, and optional links
- **Track Watching Status**: Categorize series as "Watching", "Watched", or "Plan to Watch"
- **Rate Watched Shows**: Give ratings to series you've completed
- **Sort & Filter**: Organize your list by date added and watching status
- **Persistent Storage**: All data is saved to localStorage for persistent experience
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Dark/Light Theme**: Toggle between dark and light modes with automatic system preference detection

## Tech Stack

- React (with Hooks)
- Tailwind CSS
- Local Storage API
- Vite

## Usage

### Adding a New Series

1. Fill in the required title field (marked with *)
2. Optionally add genre, links, and image URL
3. Select the watching status
4. Click "Add Series"

### Managing Your Series

- **Edit**: Modify any details of an existing series
- **Remove**: Delete a series from your list
- **Rate**: For completed series, assign a rating from 1-10
- **Sort**: Arrange by date added (newest or oldest first)
- **Filter**: View series by watching status

### Theme Switching

- Click the theme toggle button to switch between dark and light modes
- The app automatically detects and applies your system's color scheme preference on first load

## Installation and Setup

1. Clone this repository
```
git clone https://github.com/mirrerror/SimpleTVSeriesList.git
```

2. Navigate to the project directory
```
cd tv-series-tracker
```

3. Install dependencies
```
npm install
```

4. Start the development server
```
npm run dev
```

5. For production build
```
npm run build
```

## Local Storage

The application uses your browser's localStorage to save:
- Your list of TV series
- Your theme preference (dark/light)

No data is sent to any server - everything is stored locally on your device.

## Responsive Design

The app is fully responsive with optimized layouts for:
- Mobile phones (< 768px)
- Desktop computers (≥ 768px)

---

Created with ❤️ by mirrerror