import { Children, CSSProperties, ReactNode } from "react";

export interface ColumnProperties {
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

export default function Column({ children, ...props }: ColumnProperties) {
  if (props.tableStyle?.borderCollapse == null) {
    if (props.tableStyle == null) {
      props.tableStyle = { borderCollapse: "collapse" }
    } else {
      props.tableStyle.borderCollapse = "collapse"
    }
  }
  
  return <table className={ props.tableClass } style={ props.tableStyle }>
    <tbody className={ props.tableBodyClass } style={ props.tableBodyStyle }>
        {
          Children.map(children, (element) => (
            <tr className={ props.tableRowClass } style={ props.tableRowStyle }>
              <td className={ props.tableDataClass } style={ props.tableDataStyle }>
                { element }
              </td>
            </tr>
          ))
        }
    </tbody>
  </table>
}

