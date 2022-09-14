import {
  defineComponent,
} from 'vue';

export default defineComponent({
  props: {
    title: String,
  },

  setup(props, { slots }) {
    return () => (
      <h3>
        Hello { props.title }
      </h3>
    );
  },
});
