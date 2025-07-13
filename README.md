# FavouriteMovie.com

A React application that allows users to search for movies, series, or episodes and create bookmarks for their favorite items using the OMDb API.

## Features

### Core Features
- **Search Functionality**: Search for movies, series, or episodes by title
- **Category Filtering**: Search one category at a time (movie/series/episode)
- **Responsive Grid Layout**: Display up to three items per row
- **Bookmark System**: Add and remove bookmarks for favorite items
- **Bookmarks View**: View all bookmarked items in a dedicated section
- **Persistent Storage**: Bookmarks are saved to localStorage

### Display Features
- **Movie Information**: Title, year, and poster for each item
- **Detailed Information**: Ratings, runtime, and genre (when available)
- **Poster Handling**: Graceful fallback for missing posters

### Bonus Features
- **Dark/Light Theme Toggle**: Switch between light and dark themes
- **Movie Ratings**: Display IMDb ratings alongside each item
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Important**: Get your OMDb API key
   - Visit [OMDb API](https://www.omdbapi.com/)
   - Sign up for a free API key
   - Replace `YOUR_API_KEY` in `src/App.jsx` with your actual API key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Searching for Content
1. Enter a movie, series, or episode title in the search box
2. Select the category type (Movies, Series, or Episodes)
3. Click the "Search" button or press Enter
4. Results will display in a responsive grid layout

### Bookmarking Items
- Click the bookmark icon (bookmark outline) on any movie card to add it to your bookmarks
- Click the filled bookmark icon to remove an item from your bookmarks
- Bookmarked items appear in the "My Bookmarks" section

### Theme Toggle
- Click the sun/moon icon in the top-right corner to switch between light and dark themes
- Your theme preference is automatically saved

## Technical Details

### Libraries Used
- **React 19**: Modern React with hooks for state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful and consistent icon library
- **Vite**: Fast build tool and development server

### API Integration
- **OMDb API**: Free movie database API
- **Search Endpoint**: Used for finding movies by title
- **Detail Endpoint**: Used for fetching additional movie information (ratings, runtime, genre)

### State Management
- **Local State**: React hooks for component state
- **Local Storage**: Persistent storage for bookmarks and theme preference
- **Error Handling**: Graceful error handling for API failures

### Responsive Design
- **Mobile First**: Designed for mobile devices first
- **Grid System**: Responsive grid that adapts to screen size
- **Touch Friendly**: Large touch targets for mobile users

## Project Structure

```
src/
├── App.jsx          # Main application component
├── index.css        # Tailwind CSS and custom styles
└── main.jsx         # Application entry point
```

## Customization

### Styling
- Modify `src/index.css` to customize the design system
- Update `tailwind.config.js` to extend the theme
- All components use Tailwind utility classes for easy customization

### API Configuration
- Update the `OMDB_API_KEY` constant in `src/App.jsx`
- Modify API endpoints if needed

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Local storage support for bookmark persistence

## License
This project is open source and available under the MIT License.

## Contributing
Feel free to submit issues and enhancement requests!
