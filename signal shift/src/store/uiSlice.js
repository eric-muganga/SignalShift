import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isContactListVisible: false,
    messagesSearch: false,
    filteredChats: [],
    searchTerm: "",
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showContactList(state) {
            state.isContactListVisible = true;
        },
        hideContactList(state) {
            state.isContactListVisible = false;
        },
        showMessageSearch(state) {
            state.messagesSearch = true
        },
        hideMessageSearch(state) {
            state.messagesSearch = false
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
    },
});

export const { showContactList, hideContactList, showMessageSearch, hideMessageSearch, setSearchTerm } = uiSlice.actions;

export const selectIsContactListVisible = (state) => state.ui.isContactListVisible;
export const selectMessageSearch = (state) => state.ui.messagesSearch;
export const selectFilteredChats = (state) => state.ui.filteredChats;
export const selectSearchTerm = (state) => state.ui.searchTerm;

export default uiSlice.reducer;
