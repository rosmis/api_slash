const { createClient } = require("@supabase/supabase-js");

module.exports = {
  async afterCreate(data) {
    const { result: trainerResult } = data;

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(trainerResult.userId);

      if (authError) {
        console.error("Error querying user profile:", authError);
        return;
      }

      if (!authUser.user) return;

      const { email: _userEmail, id: userId } = authUser.user;

      const { data: userInfos } = await supabase.from("profiles").select("*").eq("id", userId);

      // don't perform any operations if the user has already filled in his credit infos - shoudn't happen but essential to include it
      if (userInfos[0].did_user_fill_credit_infos) return;

      // update user's profile row to did_user_fill_credit_infos to false

      await supabaseAdmin
        .from("profiles")
        .update({
          did_user_fill_credit_infos: false,
        })
        .eq("id", userId);

      // 2.send user email to invite him to fill his credit card infos
    } catch (error) {
      console.error(error);
    }
  },
};
