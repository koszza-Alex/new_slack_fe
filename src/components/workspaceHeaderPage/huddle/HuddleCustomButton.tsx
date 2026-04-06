type Props = {
  label: string;
  bgColor: string;
  textColor: string;
  hoverColor: string;
  activeColor?: string;
  height: string;
  width?: string;
  px?: string;
  rounded: string;
  fontSize: string;
  border?: string;
  onClick?: () => void; // ✅ ADD THIS
};

export function HuddleCustomButton(props: Props) {
  return (
    <button
      className="flex items-center justify-center transition-all duration-100"
      style={{
        backgroundColor: props.bgColor,
        color: props.textColor,
        height: props.height,
        width: props.width,
        paddingLeft: props.px,
        paddingRight: props.px,
        borderRadius: props.rounded,
        fontSize: props.fontSize,
        border: props.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = props.hoverColor;
      }}
      onClick={props.onClick}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = props.bgColor;
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.backgroundColor =
          props.activeColor || props.hoverColor;
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.backgroundColor = props.hoverColor;
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {props.label}
    </button>
  );
}