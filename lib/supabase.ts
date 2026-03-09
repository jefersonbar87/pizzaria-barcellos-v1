
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Credenciais de conexão do projeto Pizzaria Barcellos
const supabaseUrl = 'https://jfzyzplwiggqzjpepsvh.supabase.co';
// Nota: Se o sistema não conectar, verifique se a chave 'anon' começa com 'eyJ' no seu painel Supabase.
const supabaseKey = 'sb_publishable_XnEJuKe832tz0bFkx0Jb1Q_JmmGPtFY';

export const supabase = createClient(supabaseUrl, supabaseKey);
