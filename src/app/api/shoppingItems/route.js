
let shoppingItems = [];

export async function GET() {
  // Gibt alle Einkaufsartikel zurück
  return new Response(JSON.stringify(shoppingItems), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  // Fügt einen neuen Einkaufsartikel hinzu
  const { name, amount } = await request.json();
  
  if (!name || !amount) {
    return new Response(
      JSON.stringify({ error: 'Name and amount are required' }),
      { status: 400 }
    );
  }
  
  const newItem = { name, amount };
  shoppingItems.push(newItem);

  return new Response(JSON.stringify(newItem), { status: 201 });
}
