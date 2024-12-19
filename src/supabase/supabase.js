import {createClient} from "@supabase/supabase-js";

export const supabase= createClient(
    "https://ljuncnuhcvpelucygbca.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdW5jbnVoY3ZwZWx1Y3lnYmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0MTEwNzcsImV4cCI6MjA0Nzk4NzA3N30.1ACNqIGtl25bP0ILY8Bj4qkS0u7HsotWWSEtc8GgJAk"
    )