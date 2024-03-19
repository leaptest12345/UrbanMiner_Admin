export interface Props {
    title: string;
    onClick?: () => void;
    width?: 'full' | 'fit';
    isDisabled?: boolean;
    type?: 'primary' | 'secondary';
}
