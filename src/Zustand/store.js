import axios from "axios";
import zustand, { create } from "zustand";
import { API } from "../utils/utils";

export const tabloStore = create((set, get) => ({
    errors: [],
    token: JSON.parse(localStorage.getItem('token')) || {},
    talons: [],
    employee: {},
    loginLoading: false,
    getTalonsLoading: false,
 
    getTalons: async (id) => {
        set({ getTalonsLoading: true });
        try {
           const res = await axios.get(`${API}/branch/window/${id}`);
  
           set({
              talons: res.data,
           });
        } catch (error) {
           console.log(error, ' <<<<<Ошибка при получений данных');
        } finally {
           set({ getTalonsLoading: false });
        }
     },


}))