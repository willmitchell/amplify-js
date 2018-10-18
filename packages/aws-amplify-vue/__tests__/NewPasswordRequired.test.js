/* eslint-disable */
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import * as AmplifyUI from '@aws-amplify/ui';
import NewPasswordRequired from '../src/components/authenticator/NewPasswordRequired.vue';
import AmplifyEventBus from '../src/events/AmplifyEventBus';
import { AmplifyPlugin } from '../src/plugins/AmplifyPlugin';
import * as AmplifyMocks from '../__mocks__/Amplify.mocks';
/* eslint-enable */

Vue.use(AmplifyPlugin, AmplifyMocks);

function setPasswords(wrapper){
  wrapper.password1 = wrapper.password2 = wrapper.oldpassword;
}

describe('NewPasswordRequired', () => {
  it('has a mounted hook', () => {
    expect(typeof NewPasswordRequired.mounted).toBe('function');
  });

  it('sets the correct default data', () => {
    expect(typeof NewPasswordRequired.data).toBe('function');
    const defaultData = NewPasswordRequired.data();
    expect(defaultData.logger).toEqual({});
    expect(defaultData.error).toEqual('');
  });

  let wrapper;
  let header;
  const mockSend = jest.fn();
  const mockSubmit = jest.fn();
  const mockSignIn = jest.fn();
  const mockSetError = jest.fn();
  let testState;

  describe('...when it is mounted without props...', () => {
    beforeEach(() => {
      wrapper = shallowMount(NewPasswordRequired);
    });

    it('...it should use the amplify plugin with passed modules', () => {
      expect(wrapper.vm.$Amplify).toBeTruthy();
    });

    it('...it should be named NewPasswordRequired', () => {
      expect(wrapper.vm.$options.name).toEqual('NewPasswordRequired');
    });

    it('...it should instantiate a logger with the name of the component', () => {
      expect(wrapper.vm.logger.name).toEqual(wrapper.vm.$options.name);
    });

    it('...should have a submit method', () => {
      expect(wrapper.vm.submit).toBeTruthy();
    });

    it('...should have a signIn method', () => {
      expect(wrapper.vm.signIn).toBeTruthy();
    });

    it('...it should have a setError method', () => {
      expect(wrapper.vm.setError).toBeTruthy();
    });

    it('...have default options', () => {
      expect(wrapper.vm.options.header).toEqual('New Password Required');
      expect(Object.keys(wrapper.vm.options.user).length).toEqual(0);
    });

    it('...should set the error property when a valid user is not received', () => {
      expect(wrapper.vm.error).toEqual('Valid user not received.');
    });

    it('...should call Auth.setPassword when submit function is called', () => {
      setPasswords(wrapper);
      wrapper.vm.submit();
      expect(AmplifyMocks.Auth.changePassword).toHaveBeenCalled();
    });

    it('...should call emit the authState event when signIn function is called', () => {
      AmplifyEventBus.$on('authState', () => {
        testState = 'eventsAreEmitting';
      });
      expect(testState).toBeUndefined();
      wrapper.vm.signIn();
      expect(testState).toEqual('eventsAreEmitting');
    });
  });

  describe('...when it is mounted with props...', () => {
    beforeEach(() => {
      header = 'New Password Required';
      wrapper = shallowMount(NewPasswordRequired, {
        methods: {
          submit: mockSubmit,
          signIn: mockSignIn,
          setError: mockSetError,
        },
        propsData: {
          newPasswordRequiredConfig: {
            user: { username: 'TestPerson' },
            header,
          },
        },
      });
    });

    afterEach(() => {
      mockSubmit.mockReset();
      mockSignIn.mockReset();
      mockSetError.mockReset();
    });
    it('...should not set the error property', () => {
      expect(wrapper.vm.error).toEqual('');
      expect(mockSetError).not.toHaveBeenCalled();
    });

    it('...should render the header from props', () => {
      const el = wrapper.find(`.${AmplifyUI.sectionHeader}`).element;
      expect(el.textContent).toEqual(header);
    });

    // it('...should call send when send button is clicked', () => {
    //   const el = wrapper.find(`.${AmplifyUI.hint} > .${AmplifyUI.a}`);
    //   el.trigger('click');
    //   expect(mockSend).toHaveBeenCalled();
    // });

    // it('...should not call submit when submit button is clicked but code is not present', () => {
    //   const el = wrapper.find('button');
    //   el.trigger('click');
    //   expect(mockSubmit).not.toHaveBeenCalled();
    // });

    it('...should call submit when submit button is clicked and passwords are set present', () => {
      const el = wrapper.find('button');
      setPasswords(wrapper)
      el.trigger('click');
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
