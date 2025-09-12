'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UsernameResponse, useSetUsernameMutation } from '@/api/auth';

interface UsernameModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UsernameModal({ isOpen, onOpenChange }: UsernameModalProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useSetUsernameMutation();

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const value = username.trim();
    if (!value) {
      setError(t('username.emptyError'));
      return;
    }
    setError(null);

    mutate(
      { username: value },
      {
        onSuccess: (result: UsernameResponse) => {
          if ('success' in result && result.success) {
            addToast({
              title: t('username.successTitle'),
              description: t('username.successDescription'),
              color: 'success',
              variant: 'flat',
            });
            onOpenChange(false);
          } else if ('error' in result && result.error === 'already-in-use') {
            setError(t('username.inUseError'));
          } else if (
            'error' in result &&
            result.error === 'already-set'
          ) {
            addToast({
              title: t('username.alreadyCompletedTitle'),
              description: t('username.alreadyCompletedDescription'),
              color: 'warning',
              variant: 'flat',
            });
            onOpenChange(false);
          } else {
            setError(t('username.genericError'));
          }
        },
        onError: () => {
          setError(t('username.genericError'));
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton tabIndex={-1}>
      <ModalContent className="bg-indigo-950 border-2 border-black">
        <ModalHeader className="text-cyan-400 font-bold">
          {t('username.title')}
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-300 text-sm">
            {t('username.description')}
          </p>
          <Input
            placeholder={t('username.label')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={!!error}
            errorMessage={error || undefined}
            isDisabled={isPending}
            tabIndex={0}
            classNames={{
              input: 'text-lg outline-none placeholder-gray-400 ',
              inputWrapper:
                'border-black border-2 rounded-md ',
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="border-2 border-black bg-cyan-500 text-white font-bold"
            isDisabled={isPending}
            onPress={handleSubmit}
          >
            {isPending ? t('username.saving') : t('username.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
