export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/assets/list`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="text-center text-red-500">
        Failed to load assets
      </div>
    );
  }

  const assets: {
    id: number;
    name: string;
    category: string;
    description?: string | null;
  }[] = await res.json();

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Company Asset Manager
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto">
          Browse available company assets including laptops,
          licenses, servers, and shared resources.
        </p>
      </section>

      {/* ASSET GRID */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Available Assets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="
                rounded-2xl
                bg-linear-to-br
                from-gray-900
                to-black
                border border-gray-800
                p-6
                shadow-lg
                hover:scale-[1.02]
                transition
              "
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {asset.name}
                </h3>

                <p className="text-sm text-gray-400">
                  Category: {asset.category}
                </p>

                {asset.description && (
                  <p className="text-sm text-gray-500">
                    {asset.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pt-10">
        <p className="text-gray-400 mb-4">
          Want to request an asset?
        </p>

        <a
          href="/login"
          className="inline-block bg-blue-600 px-6 py-3 rounded-xl text-white hover:bg-blue-700 transition"
        >
          Login to Request Assets
        </a>

        <a
          href="/register"
          className="inline-block bg-gray-700 px-6 py-3 rounded-xl text-white hover:bg-gray-800 transition ml-4"
        >
          Register
        </a>
      </section>
    </div>
  );
}
