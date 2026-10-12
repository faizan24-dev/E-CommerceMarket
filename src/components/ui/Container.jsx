/** The standard page width and side padding. */
export default function Container({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
