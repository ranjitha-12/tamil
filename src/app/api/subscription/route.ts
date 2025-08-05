import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import SubscriptionModel from '@/models/subscriptionModel';

// GET all subscription plans
export async function GET() {
  try {
    await connectMongoDB();
    const plans = await SubscriptionModel.find();
    return NextResponse.json(plans);
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

// POST a new subscription plan
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const { name, price, features, value } = data;
    if (!name || !price || !features || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPlan = await SubscriptionModel.create({ name, price, features, value });
    return NextResponse.json(newPlan, { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

// PUT update subscription plan by ID
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
  }
  try {
    await connectMongoDB();
    const data = await req.json();
    const updatedPlan = await SubscriptionModel.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedPlan);
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE a subscription plan by ID
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
  }
  try {
    await connectMongoDB();
    await SubscriptionModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}
