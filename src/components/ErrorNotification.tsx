import React from 'react';

interface Props {
  message: string | null;
  visible: boolean;
  onHide: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  message,
  visible,
  onHide,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${
      visible ? '' : 'is-hidden'
    }`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
    {message}
  </div>
);
