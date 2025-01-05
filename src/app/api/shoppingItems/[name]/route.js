
let shoppingItems = [
  { name: 'Apple', amount: 10 },
  { name: 'Banana', amount: 5 },
];

// GET-Anfrage: Artikel nach Name abrufen
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const name = url.pathname.split('/').pop();

    const item = shoppingItems.find((i) => i.name === name);
    if (!item) {
      return new Response(
        JSON.stringify({ error: `Item with name ${name} not found` }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    );
  }
}

// PUT-Anfrage: Artikel aktualisieren
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const name = url.pathname.split('/').pop();

    const { amount } = await req.json();

    if (typeof amount !== 'number' || amount < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount value, it should be a non-negative number' }),
        { status: 400 }
      );
    }

    const index = shoppingItems.findIndex((i) => i.name === name);
    if (index === -1) {
      return new Response(
        JSON.stringify({ error: `Item with name ${name} not found` }),
        { status: 404 }
      );
    }

    shoppingItems[index] = { name, amount };

    return new Response(JSON.stringify(shoppingItems[index]), { status: 200 });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    );
  }
}

// DELETE-Anfrage: Artikel löschen
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const name = url.pathname.split('/').pop();

    const itemExists = shoppingItems.some((i) => i.name === name);
    if (!itemExists) {
      return new Response(
        JSON.stringify({ error: `Item with name ${name} not found` }),
        { status: 404 }
      );
    }

    shoppingItems = shoppingItems.filter((i) => i.name !== name);

    return new Response(
      JSON.stringify({ message: `Item with name ${name} deleted` }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    );
  }
}
