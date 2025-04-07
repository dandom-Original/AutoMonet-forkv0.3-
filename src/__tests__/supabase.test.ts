import { supabase } from '../integrations/supabase';

describe('Supabase Connection', () => {
  test('can connect to Supabase', async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeInstanceOf(Array);
  });
});
