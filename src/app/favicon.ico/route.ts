import Icon from '../icon';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return Icon();
}

