import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // cek email
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.json({
        status: false,
        message: "Email sudah dipakai",
      });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // generate member code
    const year = new Date()
      .getFullYear()
      .toString()
      .slice(-2);

    const { count } = await supabase
      .from("users")
      .select("*", {
        count: "exact",
        head: true,
      });

    const sequence = String(
      (count || 0) + 1
    ).padStart(4, "0");

    const memberCode = `${year}${sequence}`;

    // insert user
    const { error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashed,
        phone,
        member_code: memberCode,
      });

    if (error) {
      return res.json({
        status: false,
        message: error.message,
      });
    }

    res.json({
      status: true,
      message: "Register berhasil",
    });

  } catch (err) {

    res.status(500).json({
      status: false,
      message: err.message,
    });

  }
};

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.json({
        status: false,
        message: "Email tidak ditemukan",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.json({
        status: false,
        message: "Password salah",
      });
    }

    res.json({
      status: true,
      user,
    });

  } catch (err) {

    res.status(500).json({
      status: false,
      message: err.message,
    });

  }
};

export const updateProfile = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      id,
      name,
      phone,
      nik,
      birth,
      gender,
    } = req.body;

    let imageUrl = null;

    // =========================
    // UPLOAD FOTO
    // =========================
    if (req.file) {

      const fileExt =
        req.file.originalname
          .split(".")
          .pop();

      const fileName =
        `profile-${Date.now()}.${fileExt}`;

      console.log(
        "UPLOAD FILE:",
        fileName
      );

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from("profile")
        .upload(
          fileName,
          req.file.buffer,
          {
            contentType:
              req.file.mimetype,
            upsert: true,
          }
        );

      console.log(
        "UPLOAD RESULT:",
        uploadData
      );

      console.log(
        "UPLOAD ERROR:",
        uploadError
      );

      if (uploadError) {

        return res.status(500).json({
          status: false,
          message:
            uploadError.message,
        });

      }

      // ambil public url
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("profile")
        .getPublicUrl(fileName);

      imageUrl =
        publicUrlData.publicUrl;

      console.log(
        "IMAGE URL:",
        imageUrl
      );

    }

    // =========================
    // UPDATE DATABASE
    // =========================
    const updateData = {
      name,
      phone,
      nik,
      birth,
      gender,
    };

    // simpan foto kalau ada
    if (imageUrl) {

      updateData.profile_image =
        imageUrl;

    }

    console.log(
      "UPDATE DATA:",
      updateData
    );

    const {
      data,
      error,
    } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    console.log(
      "DB ERROR:",
      error
    );

    console.log(
      "DB DATA:",
      data
    );

    if (error) {

      return res.status(500).json({
        status: false,
        message: error.message,
      });

    }

    return res.json({
      status: true,
      user: data,
    });

  } catch (err) {

    console.log(
      "SERVER ERROR:",
      err
    );

    return res.status(500).json({
      status: false,
      message: err.message,
    });

  }

};

export const googleCallback = async (req, res) => {
  try {

    const profile = req.user;

    const email =
      profile.emails[0].value;

    // cek user
    const { data: existingUser } =
      await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    // kalau belum ada akun
    if (!existingUser) {
      return res.redirect(
        "http://localhost:5173/login"
      );
    }

    // encode user
    const userData =
      encodeURIComponent(
        JSON.stringify(existingUser)
      );

    // redirect frontend
    return res.redirect(
      `http://localhost:5173/google-success?user=${userData}`
    );

  } catch (err) {

    console.log(err);

    return res.redirect(
      "http://localhost:5173/login"
    );

  }
};