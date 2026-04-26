import { Children, CSSProperties, ReactNode } from "react";

export interface RowProperties {
  tableClass?: string,
  tableStyle?: CSSProperties,
  
  tableRowClass?: string,
  tableRowStyle?: CSSProperties,
  
  tableBodyClass?: string,
  tableBodyStyle?: CSSProperties,
  
  tableDataClass?: string,
  tableDataStyle?: CSSProperties,
  
  children?: ReactNode
}

export default function Row({ children, ...props }: RowProperties) {
  if (props.tableStyle?.borderCollapse == null) {
    if (props.tableStyle == null) {
      props.tableStyle = { borderCollapse: "collapse" }
    } else {
      props.tableStyle.borderCollapse = "collapse"
    }
  }
  
  return <table className={ props.tableClass } style={ props.tableStyle }>
    <tbody className={ props.tableBodyClass } style={ props.tableBodyStyle }>
      <tr className={ props.tableRowClass } style={ props.tableRowStyle }>
        {
          Children.map(children, (element) => (
            <td className={ props.tableDataClass } style={ props.tableDataStyle }>
              { element }
            </td>
          ))
        }
      </tr>
    </tbody>
  </table>
}

