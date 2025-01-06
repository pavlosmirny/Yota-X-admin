import { Chip, ChipProps, alpha } from "@mui/material";
// Функция для генерации стабильного цвета на основе строки
const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

interface TagChipProps extends Omit<ChipProps, "color"> {
  label: string;
}

export const TagChip = ({ label, ...props }: TagChipProps) => {
  const baseColor = stringToColor(label);

  return (
    <Chip
      {...props}
      label={label}
      sx={{
        bgcolor: alpha(baseColor, 0.1),
        color: baseColor,
        borderColor: alpha(baseColor, 0.3),
        "&:hover": {
          bgcolor: alpha(baseColor, 0.2),
        },
        ...props.sx,
      }}
    />
  );
};
