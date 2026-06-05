import supabase from "../config/supabase.js";
import axios from "axios";

export const addBorrowBook = async (req, res) => {
  try {
    const { title, author, category, stock, description, cover } = req.body;

    const { data, error } = await supabase
      .from("borrow_books")
      .insert([
        { title, author, category, stock, description, cover }
      ])
      .select();

    if (error) throw error;

    return res.json({
      status: true,
      data,
    });

  } catch (err) {
    // 🔥 penting ini
    if (err.code === "23505") {
      return res.status(409).json({
        status: false,
        message: "Book already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const addShopBook = async (req, res) => {
  try {
    const { title, author, category, stock, price, description, cover } = req.body;

    const { data, error } = await supabase
      .from("books") // 👈 ini SHOP TABLE
      .insert([
        { title, author, category, stock, price, description, cover }
      ])
      .select();

    if (error) throw error;

    return res.json({
      status: true,
      data,
    });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: false,
        message: "Book already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

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