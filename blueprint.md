# Magic: The Gathering Deck Builder

## Overview

A React web application to help users manage their Magic: The Gathering card decks. Users can search for cards, create and save their decks, and see which cards they are missing.

## Features

*   **Card Search:** Search for Magic cards by name using the [Magic: The Gathering API](https://magicthegathering.io/).
*   **Deck Management:** Create, view, and manage personal decks.
*   **Missing Cards:** View a list of missing cards required to complete a deck.
*   **User Accounts:** User profile page with nested navigation for managing decks and settings.

## Project Structure & Plan

This document outlines the plan for building the application.

### Current Step: Deck Details Page & State Refactoring

1.  **Acknowledge user request and clarify project type (React Web App).**
2.  **Create `blueprint.md` file.**
3.  **Install `react-router-dom` for navigation.**
4.  **Create file structure:**
    *   `src/pages/` for page components.
    *   `src/components/` for reusable components.
5.  **Create placeholder page components:**
    *   `Home.jsx`
    *   `Search.jsx`
    *   `Profile.jsx`
    *   `MyDecks.jsx`
    *   `Settings.jsx`
6.  **Set up routing in `App.jsx`.**
7.  **Create a `Navbar` component.**
8.  **Clean up initial project files.**
9.  **Apply basic global styles and a dark theme.**
10. **Style the `Navbar` component.**
11. **Design and style the `Home` page with a prominent search bar and quick links.**
12. **Install `axios` for API requests.**
13. **Implement the card search functionality in `Search.jsx`.**
14. **Style the search results grid and card items.**
15. **Create the user profile page layout with a sidebar and content area.**
16. **Style the profile page and sidebar.**
17. **Implement nested routing for `MyDecks` and `Settings` within the profile page.**
18. **Implement `MyDecks` component with mock data and initial styling.**
19. **Implement `Settings` component with a placeholder form and styling.**
20. **Debug and fix application startup issue by restoring `src/main.jsx`.**
21. **Create `NewDeckModal` component for creating new decks.**
22. **Style the `NewDeckModal` component.**
23. **Integrate `NewDeckModal` into `MyDecks.jsx` to handle deck creation.**
24. **Implement state management and save functionality in the `Settings` component.**
25. **Clear initial mock data from `MyDecks.jsx` and make deck cards clickable.**
26. **Create a `DeckDetail.jsx` page component.**
27. **Add a new route for `/deck/:deckId` in `App.jsx`.**
28. **Refactor state management by lifting the `decks` state to `App.jsx`.**
29. **Pass `decks` and `onSaveDeck` props to child components.**
30. **Update `DeckDetail.jsx` to retrieve deck information from props.**

### Next Steps

*   Add functionality to the search bar on the `Home` page to redirect to the `Search` page with the query.
*   Implement deck editing and deletion.
*   Allow users to add cards to their decks.
*   Flesh out the `DeckDetail` page to show the list of cards in the deck.
