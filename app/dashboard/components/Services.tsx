import Image from 'next/image';
import { getServices } from '@/app/admin/actions';

export default async function Services() {
    const services = await getServices();

    // If no services, don't render the section
    if (services.length === 0) {
        return null;
    }

    return (
        <div className="mt-12" id="services">
            <h2 className="text-3xl font-black text-white mb-8">Nuestros Servicios</h2>

            <div className="flex overflow-x-auto pb-6 gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="flex-shrink-0 w-64 h-80 relative rounded-3xl overflow-hidden snap-start group"
                    >
                        {/* Background Image or Gradient */}
                        {service.imageUrl ? (
                            <Image
                                src={service.imageUrl}
                                alt={service.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                {service.name}
                            </h3>
                            {service.description && (
                                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                                    {service.description}
                                </p>
                            )}
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-[#D09E1E] font-bold text-lg">
                                    ${service.price}
                                </span>
                                <span className="text-zinc-500 text-sm">
                                    {service.duration}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}