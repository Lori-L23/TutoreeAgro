import React from "react";
import { FiCheckCircle, FiTarget, FiUsers, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import propos from "../assets/propos.avif";

// Composant de section réutilisable
const Section = ({ children, className = "", id = "" }) => (
  <section className={`py-16 px-6 md:px-16 ${className}`} id={id}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

// Composant de carte de valeur
const ValueCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.2 }}
    className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
  >
    <Icon className="mx-auto text-green-600 text-4xl mb-4" />
    <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

// Composant de titre de section
const SectionTitle = ({ children, className = "" }) => (
  <h2 className={`text-3xl font-bold text-center mb-12 ${className}`}>
    {children}
  </h2>
);

const APropos = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-700 to-green-600 text-white py-24 text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            À propos de notre plateforme
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
          >
            Découvrez notre mission pour promouvoir les produits
            agroalimentaires "Made in Cameroon"
          </motion.p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🌿</span>
              <h2 className="text-2xl font-semibold">Notre Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Notre plateforme vise à mettre en lumière les producteurs locaux,
              les transformateurs et distributeurs camerounais en valorisant
              leurs produits agroalimentaires. Nous voulons offrir une vitrine
              digitale qui connecte les consommateurs aux artisans du terroir
              camerounais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🚀</span>
              <h2 className="text-2xl font-semibold">Notre Vision</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Faire du "Made in Cameroon" une référence de qualité, durable et
              accessible dans le monde entier. Nous croyons en l'innovation
              locale, la souveraineté alimentaire et la richesse du patrimoine
              agricole du Cameroun.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Valeurs */}
      <Section className="bg-gray-50">
        <SectionTitle>Nos Valeurs</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={FiCheckCircle}
            title="Qualité"
            description="Des produits sélectionnés pour leur excellence et leur authenticité."
            delay={0}
          />
          <ValueCard
            icon={FiUsers}
            title="Solidarité"
            description="Soutien aux producteurs et aux petites entreprises locales."
            delay={1}
          />
          <ValueCard
            icon={FiTarget}
            title="Engagement"
            description="Promotion d'une consommation responsable et durable."
            delay={2}
          />
        </div>
      </Section>

      {/* Chiffres clés */}
      <Section>
        <SectionTitle>Notre Impact</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "150+", label: "Producteurs" },
            { number: "500+", label: "Produits" },
            { number: "10K+", label: "Clients" },
            { number: "20+", label: "Régions" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-green-50 rounded-lg"
            >
              <p className="text-3xl font-bold text-green-700 mb-2">
                {item.number}
              </p>
              <p className="text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Appel à action */}
      <Section className="relative bg-green-700 text-white overflow-hidden">
        {/* Image en fond */}
        <img
          src={propos}
          alt="Produits camerounais"
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />

        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-20 z-0"></div>

        {/* Contenu compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 py-12 md:py-16"
        >
          <h2 className="text-3xl md:text-3xl font-bold mb-4">
            🌍 Rejoignez le mouvement Made in Cameroon
          </h2>
          <p className="text-green-100  mb-6 max-w-xl mx-auto text-base md:text-lg">
            Que vous soyez producteur, entreprise ou consommateur, engagez-vous
            à soutenir l'économie locale.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/inscription"
            className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
          >
            Créer un compte <FiArrowRight className="ml-2" />
          </motion.a>
        </motion.div>
      </Section>
    </div>
  );
};

export default APropos;
