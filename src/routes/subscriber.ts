import { Hono } from 'hono';
import { Subscriber } from '../models/subscriber';

export const subscriber = new Hono();

subscriber.get('/', async (c) => {
  const { name } = c.req.query(); // kann string sein oder nicht defined

  const subscribers = await Subscriber.findAll(name); // nimmt undefined entgegen oder string

  return c.json({
    data: subscribers,
  });
});
subscriber.get('/:id', async (c) => {
  const { id } = c.req.param();

  try {
    const subscribers = await Subscriber.find(id);
    return c.json(
      {
        data: subscribers,
      },
      200
    );
  } catch (error) {}
});

subscriber.get('/:id', async (c) => {
  const id = c.req.param('id');
  const subscriber = await Subscriber.find(id);

  return c.json(
    {
      data: subscriber,
    },
    200
  );
});

subscriber.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json(); 

  try {
    const updatedSubscriber = await Subscriber.update(id, body);

    if (updatedSubscriber) {
      return c.json({ message: 'Subscriber updated successfully', data: updatedSubscriber }, 200);
    } else {
      return c.text('Subscriber not found or update failed', 404);
    }
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return c.text('Internal server error', 500);
  }
});

subscriber.post('/', async (c) => {
  const body = await c.req.json();
  try {
    const newSubscriber = await Subscriber.create(body);
    return c.json({ message: 'Subscriber created successfully', data: newSubscriber }, 201);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return c.text('Internal server error', 500);
  }
});






subscriber.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deletedSubscriber = await Subscriber.delete(id);
    if (deletedSubscriber) {
      return c.json({ message: 'Subscriber deleted successfully', data: deletedSubscriber }, 200);
    } else {
      return c.text('Subscriber not found', 404);
    }
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return c.text('Internal server error', 500);
  }
});
