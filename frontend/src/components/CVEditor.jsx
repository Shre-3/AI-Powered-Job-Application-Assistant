export default function CVEditor({ label = "CV", value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        className="large-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
