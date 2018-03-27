import React from 'react'

const StudList = (props) => {

    return (
        <tbody>
            {Object.keys(props.students).map((key, index) => {
                return (
                    <tr key={key}>
                        <th scope="row">{props.students[index].gpa}</th>
                        <td>{props.students[index].name}</td>
                        <td>{props.students[index].email}</td>

                    </tr>
                )
            })
            }
        </tbody>
    )
};

export default StudList