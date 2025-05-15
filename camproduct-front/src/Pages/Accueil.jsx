import React from 'react'
import { FiSearch, FiShoppingCart, FiUser, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import im1 from '../assets/miel.jpg'
import im2 from '../assets/cacao.jpg'
import im3 from '../assets/lemonade.jpg'

function Accueil() {


//   return (
//     <main className="container mx-auto px-4 py-10">
//         <section className="text-center mb-12">
//           <h2 className="text-2xl font-semibold mb-4">Nos objectifs</h2>
//           <p className="text-gray-700 max-w-xl mx-auto">
//             Valoriser les produits agricoles, artisanaux et alimentaires des entreprises camerounaises,
//             en leur offrant une vitrine digitale accessible et moderne.
//           </p>
//         </section>

//         <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="bg-white shadow rounded-xl p-6 hover:scale-105 transition">
//             <h3 className="text-lg font-bold text-[#4CAF50] mb-2">Produits naturels</h3>
//             <p className="text-sm">Fruits, légumes, jus, épices... directement issus du terroir camerounais.</p>
//           </div>
//           <div className="bg-white shadow rounded-xl p-6 hover:scale-105 transition">
//             <h3 className="text-lg font-bold text-[#4CAF50] mb-2">Entreprises locales</h3>
//             <p className="text-sm">Des PME et artisans qui valorisent le savoir-faire local et durable.</p>
//           </div>
//           <div className="bg-white shadow rounded-xl p-6 hover:scale-105 transition">
//             <h3 className="text-lg font-bold text-[#4CAF50] mb-2">Marché accessible</h3>
//             <p className="text-sm">Une plateforme pour mieux connecter producteurs et consommateurs.</p>
//           </div>
//         </section>
//       </main>
//   )
return (
    <div className="min-h-screen bg-agri-cream-50">
 
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-agri-green to-agri-brown text-gray-800 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Découvrez l'<span className="text-agri-yellow">authenticité</span> locale
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Des produits agroalimentaires camerounais 100% naturels, directement des producteurs à votre table.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products" 
              className="bg-agri-yellow text-agri-brown font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center"
            >
              Explorer les produits <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-agri-green font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              Vendre mes produits
            </Link>
          </div>
        </div>
      </section>

      {/* Produits en Vedette */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-agri-green mb-2 text-center">Nos Produits Phares</h2>
        <p className="text-agri-brown/80 text-center mb-12">Découvrez les trésors du terroir camerounais</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center text-agri-green font-bold hover:underline"
          >
            Voir tous les produits <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* CTA Producteurs */}
      <section className="bg-agri-brown/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-agri-green mb-4">Vous êtes producteur ?</h2>
          <p className="text-agri-brown/80 max-w-2xl mx-auto mb-8">
            Rejoignez notre plateforme pour augmenter votre visibilité et vendre vos produits en ligne.
          </p>
          <Link 
            to="/register" 
            className="bg-agri-green text-white font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition inline-block"
          >
            Inscrivez votre entreprise
          </Link>
        </div>
      </section>

   
    </div>
  );
}
const featuredProducts = [
    {
      id: 1,
      name: "Miel d'Oku",
      category: "Apiculture",
      price: 5000,
      image: im1,
      isBulk: true
    },
    {
      id: 2,
      name: "Cacao Bio",
      category: "Épices",
      price: 3500,
      image: im2,
      isBulk: true
    },
    {
      id: 3,
      name: "Jus d'Ananas Naturel",
      category: "Boissons",
      price: 1500,
      image: im3,
      isBulk: false
    }
  ];

export default Accueil