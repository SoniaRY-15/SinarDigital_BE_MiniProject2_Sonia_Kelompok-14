const formatAge = (years, months) => {
  const parts = [];
  if (years) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (!parts.length) return "Unknown";
  return parts.join(" ");
};

module.exports = { formatAge };
