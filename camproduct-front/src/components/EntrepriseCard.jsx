import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiTarget, FiUsers, FiArrowRight } from "react-icons/fi";


const EntrepriseCard = ({ entreprise }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-2">{entreprise.name}</h3>
      <p className="text-gray-600 mb-4">{entreprise.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-green-600 font-bold">{entreprise.category}</span>
        <FiArrowRight className="text-gray-400 hover:text-green-600 cursor-pointer" />
      </div>
    </motion.div>
  );

}
export default EntrepriseCard;