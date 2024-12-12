import {createClient} from "@supabase/supabase-js";

export const supabase= createClient(
    "https://ibhzjaahbbapcdwjsdxg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHpqYWFoYmJhcGNkd2pzZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNzgzNTQsImV4cCI6MjAzNjc1NDM1NH0.C-ZNlR5H_1aBd80KS7O_62iqodzrKH2NpF7wOGmfU5k"
    )