import { Popover } from '@headlessui/react';
import { DropdownTransition } from 'components/transitions/DropdownTransition';
import { ReactComponent as IconCog } from 'assets/icons/cog.svg';
import { ReactComponent as IconSun } from 'assets/icons/sun.svg';
import { ReactComponent as IconMoon } from 'assets/icons/moon.svg';
import { useDispatch } from 'react-redux';
import { setDarkMode } from 'redux/user/user';

export const SettingsMenu = () => {
  const dispatch = useDispatch();

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center">
        <IconCog className="w-[20px]" />
      </Popover.Button>

      <DropdownTransition>
        <Popover.Panel className="dropdown-menu">
          <div className="dropdown-bubble" />
          <div className="dropdown-header">Settings</div>

          <div className="space-y-15">
            <div className="flex justify-between">
              <div>Color Mode</div>
              <div className="flex items-center">
                <button onClick={() => dispatch(setDarkMode(false))}>
                  <IconSun className="w-20" />
                </button>
                <span className="mx-10">|</span>
                <button onClick={() => dispatch(setDarkMode(true))}>
                  <IconMoon className="w-15" />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-grey-3 mt-15 mb-10" />

          <div className="text-12">Version 3.0.1</div>
        </Popover.Panel>
      </DropdownTransition>
    </Popover>
  );
};
