'use client';

import { type EquipmentCategory } from '@clarus-vitae/database/types';
import Link from 'next/link';

import { equipmentCategoryLabels } from '@/lib/treatments';

interface Equipment {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: EquipmentCategory;
  description: string;
}

interface EquipmentSectionProps {
  equipment: Equipment[];
}

export function EquipmentSection({ equipment }: EquipmentSectionProps) {
  if (equipment.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="font-display text-2xl font-medium text-clarus-navy">Equipment Variations</h2>
      <p className="mt-2 text-slate">
        Different equipment and technologies used to deliver this treatment:
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {equipment.map((item) => (
          <Link
            key={item.id}
            href={`/equipment/${item.slug}`}
            className="group rounded-lg border border-stone bg-white p-6 transition-shadow hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate">
                  {equipmentCategoryLabels[item.category]}
                </span>
                <h3 className="mt-1 font-medium text-clarus-navy group-hover:underline">
                  {item.name}
                </h3>
                {(item.brand || item.model) && (
                  <p className="mt-1 text-sm text-slate">
                    {[item.brand, item.model].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>
              <svg
                className="h-5 w-5 text-slate transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="mt-3 text-sm text-slate line-clamp-2">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
