import supabase from "../config/supabase.js";
import axios from "axios";

 // ================= KOLEKSI ================= //
export const getBorrowBooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("borrow_books")
      .select("*");

    if (error) throw error;

    return res.json({
      status: true,
      data,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

    // ================= SHOP ================= //
export const getShopBooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*");

    if (error) throw error;

    return res.json({
      status: true,
      data,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};


export const getRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;

    // contoh sederhana (sementara)
    const { data, error } = await supabase
      .from("borrow_books")
      .select("*")
      .limit(5);

    if (error) throw error;

    const books = (data || []).map((b) => ({
      workKey: "db_" + b.id,
      title: b.title,
      author: b.author,
      cover_url: b.cover,
      isLocal: true,
    }));

    return res.json({
      status: true,
      data: books,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};