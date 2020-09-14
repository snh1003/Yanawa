import React from "react";
import styled from "styled-components";
import theme from "../theme";

interface TimelineBoxProps {
    children: React.ReactNode;
    width?: string;
    height?: string;
    borderRadius?: string;
    margin?: string;
}

const StyledCard = styled.div<
    Pick<TimelineBoxProps, "width" | "height" | "borderRadius" | "margin">
    >`
  background-color: ${theme.main.base};
  box-shadow: -5px -5px 20px ${theme.main.bright},
    5px 5px 20px ${theme.main.dark};
  padding: 1rem;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: ${({ borderRadius }) => borderRadius};
  margin: ${({ margin }) => margin};
`;

const TimelineBox: React.FC<TimelineBoxProps> = ({
                                               children,
                                               width,
                                               height,
                                               borderRadius,
                                               margin,
                                           }) => {
    return (
        <StyledCard
            width={width}
            height={height}
            borderRadius={borderRadius}
            margin={margin}
        >
            {children}
        </StyledCard>
    );
};

export default TimelineBox;