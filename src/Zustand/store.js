import axios from "axios";
import zustand, { create } from "zustand";
import { API } from "../utils/utils";

export const tabloStore = create((set, get) => ({
  errors: [],
  token: JSON.parse(localStorage.getItem("token")) || {},
  talons: [],
  employee: {},
  loginLoading: false,
  getTalonsLoading: false,
  tickets: [],
  brunches: [],
  ads: [],
  address: [],
  city: [],

  getTalons: async (id) => {
    set({ getTalonsLoading: true });
    try {
      const res = await axios.get(`${API}/branch/window/${id}`);

      set({
        talons: res.data,
      });
    } catch (error) {
      console.log(error, " <<<<<Ошибка при получений данных");
    } finally {
      set({ getTalonsLoading: false });
    }
  },

  getString: async () => {
    try {
      const res = await axios.get(`${API}/branch/get_string`);
      set({
        tickets: res.data,
      });
    } catch (error) {
      console.log(error, "ERROR");
    }
  },

  getAds: async () => {
    try {
      const res = await axios.get(`${API}/branch/get_ad`);
     
      set({
        ads: res.data,
      });
   
    } catch (error) {
      console.log(error);
    }
  },


  getBranch: async () => {
   try {
     const res = await axios.get(`${API}/branch/list`);
    
     set({
       brunches: res.data,
     });
  
   } catch (error) {
     console.log(error);
   }
 },

}));
