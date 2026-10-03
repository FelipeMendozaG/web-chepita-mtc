import AttemptDetailClient from './AttemptDetailClient';

export function generateStaticParams() {
  // Parámetro inicial estático para habilitar 'output: export'
  return [{ id: 'preview' }];
}

export default function AttemptDetailPage() {
  return <AttemptDetailClient />;
}
