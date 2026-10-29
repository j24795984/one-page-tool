import source from '../../scripts/text-fade-module.mjs?raw';

export function GET() {
  return new Response(source, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Disposition': 'attachment; filename="text-fade.mjs"'
    }
  });
}
