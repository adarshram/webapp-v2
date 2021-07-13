import { useEffect, useState } from 'react';
import { SUPPORTED_WALLETS, WalletInfo } from 'services/web3/wallet/utils';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Modal } from 'components/modal/Modal';
import { setAutoLogin, shortenString } from 'utils/pureFunctions';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { FormattedMessage } from 'react-intl';
import { useAppSelector } from 'redux/index';
import { useDispatch } from 'react-redux';
import { openWalletModal } from 'redux/user/user';

export const WalletModal = () => {
  const { activate, deactivate, account, connector } = useWeb3React();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const walletModal = useAppSelector<boolean>(
    (state) => state.user.walletModal
  );
  const dispatch = useDispatch();

  const setIsOpen = (value: boolean) => {
    dispatch(openWalletModal(value));
  };

  const tryConnecting = async (wallet: WalletInfo) => {
    setPending(true);
    setSelectedWallet(wallet);
    const { connector } = wallet;

    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    )
      connector.walletConnectProvider = undefined;

    connector &&
      activate(connector, undefined, true)
        .then(async () => {
          setIsOpen(false);
          setAutoLogin(true);
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector);
            setAutoLogin(true);
          } else setError(true);
        });
  };

  const connectButton = () => {
    if (account) {
      deactivate();
      setAutoLogin(false);
      setSelectedWallet(null);
    } else {
      setError(false);
      setPending(false);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (connector) {
      const wallet = SUPPORTED_WALLETS.find(
        (x) => typeof x.connector === typeof connector
      );
      if (wallet) setSelectedWallet(wallet);
    } else setSelectedWallet(null);
  }, [walletModal, connector]);

  const title = error
    ? 'Wallet Error'
    : pending
    ? 'Connecting to ...'
    : 'Connect Wallet';

  return (
    <>
      <button
        onClick={connectButton}
        className="btn-outline-secondary btn-sm mr-40"
      >
        {selectedWallet ? (
          <img
            src={selectedWallet.icon}
            alt=""
            className="-ml-10 mr-10 w-[15px]"
          />
        ) : (
          <IconWallet className="-ml-14 mr-16 text-primary dark:text-primary-light w-[22px]" />
        )}
        {account ? (
          shortenString(account)
        ) : (
          <FormattedMessage id="connect_wallet" />
        )}
      </button>

      <Modal title={title} setIsOpen={setIsOpen} isOpen={walletModal}>
        <div className="max-h-[calc(70vh-60px)] overflow-auto px-20">
          {error ? (
            <div className="bg-error text-white mb-20 p-20 rounded-30 text-center">
              <p className="font-semibold mb-5">Failed to connect to wallet.</p>
              <p className="text-12">Please try again or contact support.</p>
            </div>
          ) : pending ? (
            <>
              <div
                className={`flex justify-center items-center mt-20 mb-40 ${
                  !error && pending ? 'animate-pulse' : ''
                }`}
              >
                <img
                  src={selectedWallet?.icon}
                  alt="Wallet Logo"
                  className="w-64 h-64 mr-30"
                />
                <h2 className="font-bold text-20">{selectedWallet?.name}</h2>
              </div>
            </>
          ) : (
            <div className="flex flex-col mb-20 mt-10 space-y-15">
              {SUPPORTED_WALLETS.map((wallet, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => tryConnecting(wallet)}
                    className="flex items-center w-full px-16 py-10 border-2 border-grey-2 rounded-20 hover:border-primary focus:outline-none focus:border-primary"
                  >
                    <img src={wallet.icon} alt="" className="w-32 h-32 mr-20" />
                    {wallet.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
