import styled from "styled-components";

const Widget = ({ data }) => {
  return (
    <StyledWidget>
      <Icon color={data.color} bgcolor={data.bgColor}>
        {data.icon}
      </Icon>
      <Text>
        <h3
          style={{
            backgroundcolor: "red",
          }}
        >
          {data.isMoney
            ? "$" + data.digits?.toLocaleString()
            : data.digits?.toLocaleString()}
        </h3>
        <p>{data.title}</p>
      </Text>
    </StyledWidget>
  );
};

export default Widget;

const StyledWidget = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin-right: 1rem;
  padding: 0.5rem;
  color: ${({ color }) => color};
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  font-size: 20px;
`;

const Text = styled.div`
  h3 {
    font-weight: 900;
  }
  p {
    font-size: 14px;
    color: black;
  }
`;

const Percentage = styled.div`
  margin-left: 0.5rem;
  font-size: 14px;
  color: ${({ isPositive }) =>
    isPositive ? "rgba(114, 225, 40)" : "rgba(255, 77, 73)"};
`;
